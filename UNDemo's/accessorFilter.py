import pandas as pd
import csv

r = pd.read_csv('DropOutRatePrimary.csv')
dropOut = pd.DataFrame(r)
##year = 2000
##dropOut = dropOut.loc[dropOut['Time Period'] == year]

r2 = pd.read_csv('LiteracyAdultsAbove15.csv')
litRates = pd.DataFrame(r2)
litRates.columns = ['Reference Area', 'Year','Value',"Notes"]
##litRates = litRates.loc[litRates['Year'] == str(year)]
result = pd.merge(dropOut, litRates, on='Reference Area')
##print(dropOut)
##print(litRates)

r3 = pd.read_csv('Countries.csv')
countries = pd.DataFrame(r3)
countries = countries.drop(countries.columns[[2,3,4,5,6,7,8,9,10]], axis=1)
countries.columns = ['Continent','Reference Area']

r4 = pd.read_csv('WorldPopGood.csv')
pop = pd.DataFrame(r4)
pop = pop.drop(pop.columns[[2,3,4,5,8]], axis=1)
pop.columns = ['Reference Area','Sub Group','YearP','Population']

##pop = pop.loc[pop['YearP'] == year]

print(pop)

result = pd.merge(dropOut, litRates, on='Reference Area')

result2 = pd.merge(result, countries, on='Reference Area')
##print(result)
result3 = pd.merge(result2, pop, on='Reference Area')
result3.to_csv('resultWorldPop.csv')



