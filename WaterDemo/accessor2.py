import pandas as pd
import csv

r = pd.read_csv('WaterAverageZipCode.csv')
dropOut = pd.DataFrame(r)

##dropOut['Location 1'] = dropOut['Location 1'].str[:5]
dropOut = dropOut.drop(dropOut.columns[0],axis=1)
dropOut.columns = ["5/6","6/7","7/8","8/9","9/10","10/11","11/12","12/13","zip"]
print(dropOut)
r2 = pd.read_csv('2010_Census_Populations_by_Zip_Code.csv')
pop = pd.DataFrame(r2)
pop.columns = ["zip",'Total',"Median Age","Males","Females","Households","AverageHouseHoldSize"]
print(pop)
result = pd.merge(dropOut, pop, on='zip')
result.to_csv('WaterWithPop.csv')
pd.concat([dropOut, pop], axis=1)
##writer = csv.writer(open('output.csv', 'w'))
##for row in r:
##    print(row)
##    writer.writerow(row)



