from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.standard.operators.python import PythonOperator
from airflow.decorators import task
import os
import sys

# Add plugins directory to path for custom utilities
sys.path.append("/opt/airflow/plugins")
from s3_utils import ensure_bucket_exists
from duckdb_utils import init_duckdb_tables, get_duckdb_connection

# Default args
default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

# DAG definition
with DAG(
    dag_id="stock_data_pipeline",
    default_args=default_args,
    description="Pipeline to process stock data using S3 and DuckDB",
    schedule=timedelta(days=1),  # replaced schedule_interval
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=["stocks", "duckdb", "s3"],
) as dag:

    @task
    def init_storage():
        """Initialize S3 buckets and DuckDB tables"""
        raw_bucket = os.getenv("RAW_DATA_BUCKET")
        processed_bucket = os.getenv("PROCESSED_DATA_BUCKET")

        ensure_bucket_exists(raw_bucket)
        ensure_bucket_exists(processed_bucket)

        init_duckdb_tables()

    @task
    def process_stock_data():
        """Process stock data and store aggregated metrics"""
        with get_duckdb_connection() as conn:
            conn.execute(
                """
                INSERT INTO aggregated_stock_metrics
                SELECT
                    symbol,
                    EXTRACT(year FROM date) AS year,
                    EXTRACT(month FROM date) AS month,
                    AVG((high + low) / 2) AS avg_price,
                    SUM(volume) AS total_volume,
                    STDDEV((high - low) / ((high + low) / 2)) AS price_volatility,
                    CURRENT_TIMESTAMP AS calc_timestamp
                FROM raw_stock_data
                GROUP BY symbol, EXTRACT(year FROM date), EXTRACT(month FROM date)
            """
            )

    # Task dependencies
    init_storage() >> process_stock_data()
