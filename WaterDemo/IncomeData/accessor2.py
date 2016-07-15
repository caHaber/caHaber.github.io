import pandas as pd
import csv

r = pd.read_csv('WaterWithPop.csv')
dropOut = pd.DataFrame(r)

##dropOut['Location 1'] = dropOut['Location 1'].str[:5]

r2 = pd.read_csv('MedianIncome.csv')
pop = pd.DataFrame(r2)

result = pd.merge(dropOut, pop, on='zip')

result.to_csv('BestMedian.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



