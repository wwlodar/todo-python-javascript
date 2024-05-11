FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1

RUN apt update --fix-missing && apt upgrade -y
RUN apt install -y make \
                   gcc \
                   libpq-dev \
                   libffi-dev \
                   libssl-dev \
                   libcurl4-openssl-dev

COPY app/backend/requirements.txt .
RUN pip install -r requirements.txt

COPY . ./

CMD ["uvicorn", "app.backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]