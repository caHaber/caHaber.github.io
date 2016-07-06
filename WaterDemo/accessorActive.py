import pandas as pd
import csv

r = pd.read_csv('Listing_of_Active_Businesses.csv')
activeB = pd.DataFrame(r)

activeB['MAILING ZIP CODE'] = activeB['MAILING ZIP CODE'].str[:5]
#print(activeB)

r2 = pd.read_csv('WaterWithPop.csv')
zipWater = pd.DataFrame(r2)

zips = zipWater["zip"].unique()
print(activeB['MAILING ZIP CODE'])

zips = pd.DataFrame(data=zips, columns=['zip'])
print(zips['zip'])
activeB = activeB[activeB["MAILING ZIP CODE"] != '-']
activeB = activeB[activeB["MAILING ZIP CODE"] != 'm8z3l']
activeB = activeB[pd.notnull(activeB['MAILING ZIP CODE'])]

zips = zips["zip"].astype('str')
activeB = activeB['MAILING ZIP CODE'].astype('str')
print(zips['zip'])
newnew = activeB[activeB['MAILING ZIP CODE'].isin(zips['zip'])]
print(newnew)
##dropOut.to_csv('WaterAverageZipCode.csv')
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



