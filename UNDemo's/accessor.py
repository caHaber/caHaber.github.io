import pandas as pd
import csv

r = pd.read_csv('DropOutRatePrimary.csv')
dropOut = pd.DataFrame(r)
r2 = pd.read_csv('LiteracyAdultsAbove15.csv')
litRates = pd.DataFrame(r2)
litRates.columns = ['Reference Area', 'Year','Value',"Notes"]
result = pd.merge(dropOut, litRates, on='Reference Area')
##print(dropOut)
##print(litRates)

r3 = pd.read_csv('Countries.csv')
countries = pd.DataFrame(r3)
countries = countries.drop(countries.columns[[2,3,4,5,6,7,8,9,10]], axis=1)
countries.columns = ['Continent','Reference Area']

r4 = pd.read_csv('worldPop.csv')
pop = pd.DataFrame(r4)
col_list = [4, 54]
pop = pop[col_list]
print(pop)


result2 = pd.merge(result, countries, on='Reference Area')
result2.to_csv('result.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



