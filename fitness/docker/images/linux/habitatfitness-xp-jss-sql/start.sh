#!/bin/bash
set -m

cleanDir=$1
dataDir=$2

# prepare data
if ls $dataDir/sc_*.mdf 1> /dev/null 2>&1; then
    echo "### Done, existing data found in '$dataDir'..."
else
    echo "### No data found in '$dataDir', seeding..."
   
    cp -R --verbose $cleanDir/. $dataDir/

    echo "### Done seeding."
fi

echo "### Starting SQLServer in background..."

/opt/mssql/bin/sqlservr &
SQL_PID=$!

echo "### SQL Server PID = '$SQL_PID'"

echo "### Attaching databases in '$dataDir':"

ls $dataDir 

for filename in $dataDir/sc_*.mdf; do
    [ -e "$filename" ] || continue

    fileBaseName=$(basename $filename .mdf)
    databaseName="${fileBaseName/_Primary/}"
    ldfPath="$dataDir/$fileBaseName.ldf"
    mdfPath=$filename 

    echo "### Ensuring '$databaseName' is attached using '$mdfPath' and '$ldfPath'..."

    /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "IF DB_ID('$databaseName') IS NULL CREATE DATABASE [$databaseName] ON (FILENAME = '$mdfPath'),(FILENAME = '$ldfPath') FOR ATTACH"
done

echo "### Preparing XConnect shards..."

/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "EXEC sp_MSforeachdb 'IF charindex(''${DB_PREFIX}'', ''?'' ) = 1 BEGIN EXEC [?]..sp_changedbowner ''sa'' END'"
/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "UPDATE [${DB_PREFIX}_Xdb.Collection.ShardMapManager].[__ShardManagement].[ShardsGlobal] SET ServerName = '${SQL_HOSTNAME}'"
/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "UPDATE [${DB_PREFIX}_Xdb.Collection.Shard0].[__ShardManagement].[ShardsLocal] SET ServerName = '${SQL_HOSTNAME}'"
/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "UPDATE [${DB_PREFIX}_Xdb.Collection.Shard1].[__ShardManagement].[ShardsLocal] SET ServerName = '${SQL_HOSTNAME}'"

echo "### Databases ready."

existuser=$(opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -h-1 -Q "set nocount on;IF SUSER_ID('${SITECORE_SQL_USERNAME}') IS NULL SELECT 'no' else select 'yes'")

if [[ "$existuser" == "no" ]]
then

    echo "### Create sql user..."

    /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -Q "IF SUSER_ID('${SITECORE_SQL_USERNAME}') IS NULL CREATE LOGIN ${SITECORE_SQL_USERNAME} WITH PASSWORD = '${SITECORE_SQL_PASSWORD}'"
fi

for filename in $dataDir/sc_*.mdf; do
    [ -e "$filename" ] || continue

    fileBaseName=$(basename $filename .mdf)
    databaseName="${fileBaseName/_Primary/}"
    ldfPath="$dataDir/$fileBaseName.ldf"
    mdfPath=$filename 

    dataUserExists=$(opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -h-1 -Q "set nocount on;IF USER_ID('${SITECORE_SQL_USERNAME}') IS NULL SELECT 'no' else select 'yes'")

    if [[ "$dataUserExists" == "no" ]]
    then
        echo "### Create user '$SITECORE_SQL_USERNAME' in '$databaseName'..."
    
        /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "CREATE USER ${SITECORE_SQL_USERNAME} FROM LOGIN ${SITECORE_SQL_USERNAME}"

         echo "### Assigning role 'owner' to user '$SITECORE_SQL_USERNAME' in '$databaseName'..."

        /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'db_owner', ${SITECORE_SQL_USERNAME}"

        # echo "### Assigning role 'db_datareader' + 'db_datawriter' to user '$SITECORE_SQL_USERNAME' in '$databaseName'..."

        # /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'db_datareader', ${SITECORE_SQL_USERNAME}"
        # /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'db_datawriter', ${SITECORE_SQL_USERNAME}"

        # if [[ "$databaseName" == *Core ]]
        # then
        #     echo "### Assigning stored procedure permissions for user '$SITECORE_SQL_USERNAME' in '$databaseName'..."
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Membership_BasicAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Membership_FullAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Membership_ReportingAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Profile_BasicAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Profile_FullAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Profile_ReportingAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Roles_BasicAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Roles_FullAccess', ${SITECORE_SQL_USERNAME}"
        #     /opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -d $databaseName -Q "EXEC sp_addrolemember 'aspnet_Roles_ReportingAccess', ${SITECORE_SQL_USERNAME}"
        # fi

    fi

done

echo "### Create Sitecore User..."

sed -i 's/PlaceHolderForUsername/'${SITECORE_ADMIN_USERNAME}'/g' /opt/createUser.sql
sed -i 's/PlaceHolderForPassword/'${SITECORE_ADMIN_PASSWORD}'/g' /opt/createUser.sql
sed -i 's/PlaceHolderForCoreDB/'${DB_PREFIX}'_Core/g' /opt/createUser.sql

/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -i /opt/createUser.sql

echo "### Set Sitecore password..."

sed -i 's/PlaceHolderForUsername/'${SITECORE_ADMIN_USERNAME}'/g' /opt/changePassword.sql
sed -i 's/PlaceHolderForPassword/'${SITECORE_ADMIN_PASSWORD}'/g' /opt/changePassword.sql
sed -i 's/PlaceHolderForCoreDB/'${DB_PREFIX}'_Core/g' /opt/changePassword.sql

/opt/mssql-tools/bin/sqlcmd -S . -U SA -P $SA_PASSWORD -t 60 -l 300 -i /opt/changePassword.sql

# Pull sql server to foreground and support SIGTERM so shutdown works

echo "### Bring SQLServer to foreground..."

fg

trap "echo '### Stopping PID $SQL_PID'; kill -SIGTERM $SQL_PID" SIGINT SIGTERM

# A signal emitted while waiting will make the wait command return code > 128
# Let's wrap it in a loop that doesn't end before the process is indeed stopped
while kill -0 $SQL_PID > /dev/null 2>&1; do
    wait
done
