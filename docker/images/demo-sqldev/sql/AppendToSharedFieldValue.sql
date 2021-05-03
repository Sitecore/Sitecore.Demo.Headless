USE [Sitecore.Master]

UPDATE [SharedFields]
SET
  Value = Value + $(Value)
WHERE
  FieldId = $(FieldId) AND ItemId = $(ItemId)