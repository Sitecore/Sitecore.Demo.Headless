USE [Sitecore.Master]

UPDATE [VersionedFields]
SET 
  Value = REPLACE(Value, $(Token), $(Replacement))
WHERE 
  FieldId = $(FieldId) AND ItemId = $(ItemId)