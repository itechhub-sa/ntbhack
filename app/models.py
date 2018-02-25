# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Audits(models.Model):
    demarcation_code = models.CharField(max_length=255)
    demarcation_label = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    opinion = models.CharField(max_length=255)
    opinion_report_url = models.CharField(max_length=255)


class Officials(models.Model):
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email_address = models.CharField(max_length=255)
    fax_number = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255)

    def natural_key(self):
        return (self.demarcation_code, self.role)

    class Meta:
        unique_together = (('demarcation_code', 'role'),)


class Maintenance(models.Model):
    demarcation_code = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    amount_type = models.CharField(max_length=255)
    financial_period = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)


class CashFlow(models.Model):
    demarcation_code = models.CharField(max_length=255)
    amount = models.CharField(max_length=255)
    amount_type = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)


class BalanceSheet(models.Model):
    amount = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255)
    demarcation_label = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)


class Capital(models.Model):
    amount_type = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255)
    demarcation_label = models.CharField(max_length=255)


class IncomeExpense(models.Model):
    amount_type = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255)
    demarcation_label = models.CharField(max_length=255)


class WastefulExpenditure(models.Model):
    amount = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255)
    demarcation_label = models.CharField(max_length=255)
    financial_year_end = models.CharField(max_length=255)
    item_label = models.CharField(max_length=255)


class Municipalities(models.Model):
    area = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    demarcation_code = models.CharField(max_length=255, primary_key=True)
    fax_number = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    postal_address_1 = models.CharField(max_length=255)
    postal_address_2 = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=255)
    province_name = models.CharField(max_length=255)
    street_address_1 = models.CharField(max_length=255)
    street_address_2 = models.CharField(max_length=255)
    street_address_3 = models.CharField(max_length=255)
    website = models.CharField(max_length=255)
    officials = models.ManyToManyField(Officials)
