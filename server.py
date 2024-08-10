import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import firebase_admin
from firebase_admin import credentials, db
from sklearn.ensemble import IsolationForest
import joblib
