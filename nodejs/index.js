var Banking = require("banking");
var fs = require("fs");
var os = require("os");

var bank = Banking({
    fid: "12345"
  , fidOrg: "Chase"
  , url: "https://url.you.get.from.ofxhome.com"
  , bankId: "123456789" /* If bank account use your bank routing number otherwise set to null */
  , user: "OnlineBankingUserName"
  , password: "OnlineBankingPassword"
  , accId: "9876543210" /* Account Number */
  , accType: "CHECKING" /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
  //, ofxVer: 102 /* default 102 */
  //, app: "QBKS" /* default  "QWIN" */
  //, appVer: "1700" /* default 1700 */
});

// date format YYYYMMDD
var startDate = 20141001; 
var endDate = 20151222;

bank.getStatement({start:startDate, end:endDate}, function(error, response){
  if(error) {console.log(error)}
  
  console.log(response);
  var transactions;
  transactions = response.body.OFX.BANKMSGSRSV1[0].STMTTRNRS[0].STMTRS[0].BANKTRANLIST[0].STMTTRN;
  var CurrentDateTime = new Date();
  var FileName = `${os.homedir()}/${CurrentDateTime.toISOString()}-${startDate}-${endDate}-transactions.json`;
  console.log(FileName);
  if(transactions) { 
    fs.writeFile(FileName, JSON.stringify(transactions)+"\n", function(error) {
      if(error) {
        return console.log(error);
      }
      console.log("The file was saved!");
    }); 
  } else { console.log("No transactions found in response from bank ofx web service"); }
});
