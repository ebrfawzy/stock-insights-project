from airflow.sdk import dag

@dag
def my_dag():
    print("hello world")