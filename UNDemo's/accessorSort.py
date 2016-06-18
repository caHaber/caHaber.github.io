import pandas as pd
import csv


r = pd.read_csv('RuralPop.csv')
pop = pd.DataFrame(r)
col_list = [0,2,4]
pop = pop.drop(pop.columns[[3,4,6]], axis=1)
pop.columns = ['Reference Area','Sub Group','Year','Population']


r2 = pd.read_csv('Countries.csv')
countries = pd.DataFrame(r2)
countries = countries.drop(countries.columns[[2,3,4,5,6,7,8,9,10]], axis=1)
countries.columns = ['Continent','Reference Area']


result = pd.merge(pop, countries, on='Reference Area')
result = result.sort_values(by=["Continent","Population"], ascending=True)

result.to_csv('RuralPopSort.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



