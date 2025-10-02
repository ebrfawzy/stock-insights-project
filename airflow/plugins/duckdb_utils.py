import os
import duckdb
from contextlib import contextmanager

@contextmanager
def get_duckdb_connection():
    """
    Context manager for DuckDB connection
    """
    db_path = os.getenv('DUCKDB_PATH', '/opt/airflow/duckdb/stocks.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = duckdb.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()

def init_duckdb_tables():
    """
    Initialize DuckDB tables if they don't exist
    """
    with get_duckdb_connection() as conn:
        # Create raw_stock_data table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS raw_stock_data (
                symbol VARCHAR,
                date DATE,
                open DOUBLE,
                high DOUBLE,
                low DOUBLE,
                close DOUBLE,
                volume BIGINT,
                source VARCHAR,
                load_timestamp TIMESTAMP
            );
        """)
        
        # Create aggregated_stock_metrics table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS aggregated_stock_metrics (
                symbol VARCHAR,
                year INTEGER,
                month INTEGER,
                avg_price DOUBLE,
                total_volume BIGINT,
                price_volatility DOUBLE,
                calc_timestamp TIMESTAMP
            );
        """)

def load_data_to_duckdb(df, table_name):
    """
    Load a pandas DataFrame into DuckDB
    """
    with get_duckdb_connection() as conn:
        conn.register('temp_df', df)
        conn.execute(f"INSERT INTO {table_name} SELECT * FROM temp_df")