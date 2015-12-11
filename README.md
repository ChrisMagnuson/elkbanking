# Overview
ELK Banking is designed to be an open source, [permissive license](https://en.wikipedia.org/wiki/Permissive_free_software_licence), privacy minded, personal finance monitoring software.

Some of the key features of the software would be:
* Download all personal financial transactions over time
* Provide a means to explore, graph, and alert on your financial data
* Serve as an automated means to ensure that if you finances are under control 
* Show you plainly where you are at and where you are going financially

[Trello board](https://trello.com/b/1hrlxF6b/elk-banking) used to track development and features.

#Installation
This process is tough and is an area that will be improved upon but I have opted to release what I have, however difficult to install and setup, in the hopes that if I am never able to work on this again I have at least provided someone else a starting point to move forward from and that anyone who is willing to take the time to follow these steps can actually reap the benefits of this software now without waiting for some more mature easier to setup future version that may never happen.

I will walk you through the process of recreating the environment I use to run and develop the software, any deviation for this for now will have to be worked out by you until we can get a nicer setup process in place.

##Steps to get your ELK Banking instance going please install the following:

* [arch linux](https://wiki.archlinux.org/index.php/Installation_guide)
* [aura](https://wiki.archlinux.org/index.php/Aura)
* [meteor](https://aur.archlinux.org/packages/meteor-js/) using `sudo aura -A meteor`
* ELK stack `sudo pacman -S elasticsearch`, `sudo aura -A logstash kibana`
* `git clone https://github.com/ChrisMagnuson/elkbanking`

##Download transactions from your bank and convert them to json format:
* Look up your bank's information on [OFXHome.com](OFXHome.com)
* `cd nodejs`
* `vim index.js`
  * Edit it to include
    * Your bank's specific fid, fidOrg, and url
    * Your bank bankId (bank account number, be sure to make this a string), user (online banking username), password (online banking password)

**This is extremely dangerous, you now have your bank account information in a directory with an initialized git repository. Never commit changes to the index.js file to your repository or you may inadvertently share your bank account information with the world. If you are not developing ELK banking but just using it you are ok, but if you ever want to make a change you need to be careful. I am working to make this safer but for now this warning will have to suffice.**
* Save and quit vim
* `node index.js`
  * You should now have a file in your home directory with a name something like `2015-12-11T00:06:58.877Z-20141001-20151222-transactions.json`

##Imported the downloaded transactions via logstash into elasticsearch:
* `cd ..\logstash`
* `vim transactionsJSON.conf` 
  * You will need to add lines like `gsub => [ "DateTimeOfTransaction", "\[\-5:EST\]", "-05:00" ]` to match whatever timezones are present in your transactions and convert the OFX timezones like [-5:EST] to more generic timezone offsets like -05:00
* Save and quit vim
* `/opt/logstash/bin/logstash -f transactionsJSON.conf`
  * You should see a '.' for each transaction imported
  * If you get date parse errors make sure you caught all the timezones in your transactions

##Analyze transactions in kibana:
* `sudo systemctl start elasticsearch kibana`
* Open a web browser to localhost:5601
* to be continued, google for videos on analyzing data with Kibana

#Plans for the future
My intent is that one day there would be service providers running this software and that at least a [zero knowledge](https://spideroak.com/features/zero-knowledge) version of this software exists that would allow only the user of the service and not the service provider to access their data.

This document is subject to change and only reflects my current intent. As I or others build out this software its licensing, use cases, privacy model, etc. may all be subject to change and the statements above should not be construed as a contract that will be held to, but a philosophy that is the starting point for this project and will evolve and mature over time.

There are questions that have not been fully answered yet, like is it better to get a free non-secure option out there so that the software is used by a larger population of people with a more secure zero knowledge paid offering available or is it better to only offer the secure option and accept the loss of users that could help perfect and evangelize the product?

I lean towards only offering a secure version at the point where this software is run by a service provider. I don't think I want the ability to subvert my user's privacy so that I cannot be forced to do so in private like was attempted with [lavabit](http://www.theguardian.com/commentisfree/2014/may/20/why-did-lavabit-shut-down-snowden-email).

I lean towards offering an insecure version that can be installed and run on anyone's own computer as they might secure their own instance through other means (run everything locally on a disk with full disk encryption).

#Licenses in use
* ELK Banking specific code MIT
* elasticsearch [Apache 2.0](https://github.com/elastic/elasticsearch/blob/master/LICENSE.txt)
* logstash [Apache 2.0](https://github.com/elastic/logstash/blob/master/LICENSE)
* kibana [Apache 2.0](https://github.com/elastic/kibana/blob/master/LICENSE.md)
* banking.js [MIT](https://github.com/euforic/banking.js/)
* meteor [MIT](https://github.com/meteor/meteor/blob/devel/LICENSE.txt)
