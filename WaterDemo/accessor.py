import pandas as pd
import csv

r = pd.read_csv('Water_Use_Average_By_Zipcode.csv')
dropOut = pd.DataFrame(r)

dropOut['Location 1'] = dropOut['Location 1'].str[:5]
##print(dropOut)

dropOut.to_csv('WaterAverageZipCode.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



