import anaconda2
import pandas as pd
import matplotlib.pyplot as plt

s = pd.read_csv('SUYI Proxy Data 2012-2013.csv');

df = pd.DataFrame(s);

df.sort('School', ascending=False);
print(df.head(30));
