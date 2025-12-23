FROM postgres:16

RUN apt-get update && apt-get install -y cron

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

CMD printenv | grep -v "no_proxy" >> /etc/environment \
    # Append the shell script logs to docker container logs
    && echo "$CRON_SCHEDULE /backup.sh >> /proc/1/fd/1 2>> /proc/1/fd/2" > /etc/cron.d/pg-backup \
    && chmod 777 /etc/cron.d/pg-backup \
    && crontab /etc/cron.d/pg-backup \
    && cron -f
