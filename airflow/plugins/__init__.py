from airflow.plugins_manager import AirflowPlugin
from duckdb_utils import get_duckdb_connection, init_duckdb_tables
from s3_utils import get_s3_client, ensure_bucket_exists, upload_to_s3

class StockInsightsPlugin(AirflowPlugin):
    name = "stock_insights"
    operators = []
    hooks = []
    executors = []
    macros = []
    admin_views = []
    flask_blueprints = []
    menu_links = []
    appbuilder_views = []
    appbuilder_menu_items = []
    
    # Register your utilities as plugins
    helpers = [
        get_duckdb_connection,
        init_duckdb_tables,
        get_s3_client,
        ensure_bucket_exists,
        upload_to_s3
    ]