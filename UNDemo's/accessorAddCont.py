import pandas as pd
import csv

r = pd.read_csv('DropOutRatePrimary.csv')
dropOut = pd.DataFrame(r)

r2 = pd.read_csv('Countries.csv')
countries = pd.DataFrame(r2)
countries = countries.drop(countries.columns[[2,3,4,5,6,7,8,9,10]], axis=1)
countries.columns = ['Continent','Reference Area']


result = pd.merge(dropOut, countries, on='Reference Area')
result = result.sort_values(by=["Continent","Observation Value"], ascending=True)
result.to_csv('DropOutWithCont.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



