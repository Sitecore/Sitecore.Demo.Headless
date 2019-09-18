SET ANSI_NULLS, QUOTED_IDENTIFIER ON;

declare @ApplicationName nvarchar(256) = 'sitecore'
declare @UserName nvarchar(256) = 'sitecore\PlaceHolderForUsername'
declare @Password nvarchar(128) = 'PlaceHolderForPassword'
DECLARE @PasswordSalt nvarchar(128) = 'sitecore'
DECLARE @Email nvarchar(256) = 'PlaceHolderForUserName@demo.sitecore.com'
DECLARE @PasswordQuestion nvarchar(256) = 'Nope'
DECLARE @PasswordAnswer nvarchar(128) = 'Nope'
DECLARE @IsApproved bit = 1
DECLARE @CurrentTimeUtc datetime = SYSUTCDATETIME()
DECLARE @CreateDate datetime = SYSUTCDATETIME()
DECLARE @UniqueEmail int = 1
DECLARE @PasswordFormat int = 1
DECLARE @UserId uniqueidentifier

-- Generate random salt
while len(@PasswordSalt) < 16
begin
    set @PasswordSalt = (@PasswordSalt + cast(cast(floor(rand() * 256) as tinyint) as nvarchar(128)))
end

EXECUTE [PlaceHolderForCoreDB].[dbo].[aspnet_Membership_CreateUser] 
   @ApplicationName
  ,@UserName
  ,@Password
  ,@PasswordSalt
  ,@Email
  ,@PasswordQuestion
  ,@PasswordAnswer
  ,@IsApproved
  ,@CurrentTimeUtc
  ,@CreateDate
  ,@UniqueEmail
  ,@PasswordFormat
  ,@UserId OUTPUT
GO