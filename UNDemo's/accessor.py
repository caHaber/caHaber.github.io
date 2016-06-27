import pandas as pd
import csv

r = pd.read_csv('DropOutRatePrimary.csv')
dropOut = pd.DataFrame(r)
r2 = pd.read_csv('PrimaryStudentMoney.csv')
litRates = pd.DataFrame(r2)
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

print(pop)


result2 = pd.merge(result, countries, on='Reference Area')

result3 = pd.merge(result2, pop, on='Reference Area')
result3.to_csv('resultWithGDPStudent.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



