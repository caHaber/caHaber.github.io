import csv
r = csv.reader(open('PartialData/2013-14/Demographics_2013-14.csv'))
print(r)
writer = csv.writer(open('output.csv', 'w'))
for row in r:
    print(row)
    writer.writerow(row)



