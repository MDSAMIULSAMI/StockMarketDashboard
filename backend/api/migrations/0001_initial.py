# Generated by Django 5.1.7 on 2025-03-10 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StockData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('trade_code', models.CharField(max_length=20)),
                ('high', models.FloatField()),
                ('low', models.FloatField()),
                ('open', models.FloatField()),
                ('close', models.FloatField()),
                ('volume', models.BigIntegerField()),
            ],
            options={
                'indexes': [models.Index(fields=['trade_code'], name='api_stockda_trade_c_20bdf0_idx'), models.Index(fields=['date'], name='api_stockda_date_4091b7_idx')],
                'unique_together': {('trade_code', 'date')},
            },
        ),
    ]
