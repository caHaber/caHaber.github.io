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

r4 = pd.read_csv('RuralPop.csv')
pop = pd.DataFrame(r4)
col_list = [0,2,4]
pop = pop.drop(pop.columns[[3,4,6]], axis=1)
pop.columns = ['Reference Area','Sub Group','Year','Population']

pop = pop[(pop['Year'] == 2000)]
print(pop)


result2 = pd.merge(result, countries, on='Reference Area')

result3 = pd.merge(result2, pop, on='Reference Area')
result3.to_csv('result.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



