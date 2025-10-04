# Dockerfile
FROM apache/airflow:slim-latest-python3.13

USER root

# system deps + psql client
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      python3-dev \
      curl \
      postgresql-client \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# create directories and set ownership (airflow user, root group in upstream image)
RUN mkdir -p /opt/airflow/{dags,logs,plugins,config,duckdb} \
 && chown -R airflow:root /opt/airflow

# switch to airflow user for pip install
USER airflow

COPY --chown=airflow:root requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# copy dags/plugins/config and start script
COPY --chown=airflow:root dags/ /opt/airflow/dags/
COPY --chown=airflow:root logs/ /opt/airflow/logs/
COPY --chown=airflow:root plugins/ /opt/airflow/plugins/
COPY --chown=airflow:root config/ /opt/airflow/config/
COPY --chown=airflow:root start.sh /usr/local/bin/start.sh

# make script executable (do as root to avoid permission problems)
USER root
RUN chmod +x /usr/local/bin/start.sh && chown airflow:root /usr/local/bin/start.sh

# Run as airflow user normally
USER airflow
ENTRYPOINT ["/usr/local/bin/start.sh"]
