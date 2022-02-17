from django.db import models
from django.db.models.deletion import CASCADE
 
 
class User(models.Model):
    id = models.CharField(max_length=200,primary_key=True)
    name = models.CharField(max_length=200,null=True)
    mc_id = models.IntegerField(null=True)
    email = models.CharField(max_length=200, unique=True,null=True)
    emailVerified = models.DateTimeField(null=True)
    image = models.CharField(max_length=1000, null=True)
    class Meta:
        db_table = 'user'
 
class Account(models.Model):
    id = models.CharField(max_length=200,primary_key=True)
    user = models.ForeignKey(User, db_column='userId', on_delete=CASCADE)
    type = models.CharField(max_length=200)
    provider = models.CharField(max_length=200)
    providerAccountId = models.CharField(max_length=200)
    refresh_token = models.TextField(max_length=1000, null=True)
    access_token = models.TextField(max_length=1000, null=True)
    expires_at = models.IntegerField(null=True)
    token_type = models.CharField(max_length=200, null=True)
    scope = models.CharField(max_length=200, null=True)
    id_token = models.TextField(max_length=1000, null=True)
    session_state = models.CharField(max_length=200, null=True)
    oauth_token_secret = models.CharField(max_length=200, null=True)
    oauth_token = models.CharField(max_length=200, null=True)
 
    class Meta:
        unique_together = [['provider', 'providerAccountId']]
        db_table = 'account'
 
 
 
class Session(models.Model):
    id = models.CharField(max_length=200,primary_key=True)
    sessionToken = models.CharField(max_length=200, unique=True)
    user = models.ForeignKey(User, db_column='userId', on_delete=CASCADE)
    expires = models.DateTimeField()
 
    class Meta:
        db_table = 'session'
 
 
class VerificationToken(models.Model):
    identifier = models.CharField(max_length=200)
    token = models.CharField(max_length=200, unique=True)
    expires = models.DateTimeField()
 
    class Meta:
        unique_together = [['identifier', 'token']]
        db_table = 'verificationtoken'
