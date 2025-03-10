from django.db import models

# Create your models here.


class StockData(models.Model):
    date = models.DateField()
    trade_code = models.CharField(max_length=20)
    high = models.FloatField()
    low = models.FloatField()
    open = models.FloatField()
    close = models.FloatField()
    volume = models.BigIntegerField()

    class Meta:
        # Create a composite index on trade_code and date for faster queries
        unique_together = ('trade_code', 'date')
        indexes = [
            models.Index(fields=['trade_code']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.trade_code} - {self.date}"
