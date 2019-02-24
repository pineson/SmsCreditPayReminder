/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, FlatList } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import { List, ListItem } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//type Props = {};
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      sms: [],
      credits: [
        { add: '10692189551186', id: '平安银行', keyword: '温馨提醒', amount: '账单金额',img:require('./icons/pab.jpg') },
        { add: '95566', id: '中国银行', keyword: '总计', amount: '总计',img:require('./icons/boc.jpg') },
        { add: '95528', id: '浦发银行', keyword: '最低还款', amount: '人民币',img:require('./icons/pdb.jpg')},
        { add: '95508', id: '广发银行', keyword: '最低还款', amount: '账单金额',img:require('./icons/gfb.jpg') },
        { add: '95555', id: '招商银行', keyword: '账单', amount: '账单金额',img:require('./icons/zsb.jpg') },
        { add: '95595', id: '光大银行', keyword: '应还', amount: '应还',img:require('./icons/gdb.jpg') },
        { add: '95533', id: '建设银行', keyword: '还需', amount: '还需',img:require('./icons/ccb.jpg') },
        { add: '1069095599', id: '农业银行', keyword: '应还款', amount: '应还款额',img:require('./icons/cab.jpg') }
      ]

    }
  }
  componentWillMount() {
    newsms = []
    //const adds=this.state.credits.map(credit=>credit.add)
    //const keywords=this.state.credits.map(credit=>credit.keyword)
    for (let credit of this.state.credits) {
      /* List SMS messages matching the filter */
      let filter = {
        box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        // the next 4 filters should NOT be used together, they are OR-ed so pick one
        //read: 1, // 0 for unread SMS, 1 for SMS already read
        //_id: 1234, // specify the msg id
        address: credit.add, // sender's phone number
        //body: '平安银行', // content to match
        // the next 2 filters can be used for pagination
        indexFrom: 0, // start from index 0
        maxCount: 10, // count of SMS to return each time
      };

      SmsAndroid.list(JSON.stringify(filter), (fail) => {
        console.log("Failed with this error: " + fail)
      },
        (count, smsList) => {
          console.log('Count: ', count);
          console.log('List: ', smsList);
          sms = JSON.parse(smsList);
          //this.setState({sms:sms})
          console.log(this.state.sms)
          sms.forEach(function (object) {
            //console.log("Object: " + object);
            //console.log("-->" + object.date);
            //console.log("-->" + object.body);
            if (object.body.match(credit.keyword)) {
              console.log("-->" + object.body);
              object.key = object._id + '';
              object.title = credit.id;
              start = object.body.indexOf(credit.amount) + credit.amount.length
              end1 = object.body.indexOf('，', object.body.indexOf(credit.amount))
              end2 = object.body.indexOf(',', object.body.indexOf(credit.amount))
              end3 = object.body.indexOf('元', object.body.indexOf(credit.amount))
              if (end1 == -1) {
                if (end3 == -1) end = end2

                else if (end2 > end3) end = end3
                else end = end2
              }
              else {
                if (end3 == -1) end = end1
                else if (end1 > end3) end = end3
                else end = end1
              }
              object.amount = object.body.substring(start, end)
              found = false;
              pofm = 0
              while (!found) {
                pofm = object.body.indexOf('月', pofm + 1)
                pofd = object.body.indexOf('日', pofm)
                if (pofd - pofm >= 2 && pofd - pofm <= 3) {
                  end = pofd + 1;
                  if (object.body.charCodeAt(pofm - 2) < 58) start = pofm - 2
                  else start = pofm - 1
                  found = true
                }
              }
              object.deadline = object.body.substring(start, end)
              object.img=credit.img
              newsms.push(object)
            }
          })

        });
    }
    this.setState({ sms: newsms })
  }

  _keyExtractor = (item, index) => item.id;
  _dateString = (d) => (d.getFullYear()) + "-" + (d.getMonth() + 1) + "-" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          //width: "86%",
          backgroundColor: "#CED0CE",
          //marginLeft: "14%"
        }}
      />
    );
  };
  render() {
    return (
      //<List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
      <FlatList
        data={this.state.sms}
        //keyExtractor={this._keyExtractor}
        //renderItem={({ item }) =><View><Text style={styles.date}>{this._dateString(new Date(item.date))}</Text><Text>{item.body}</Text></View>}
        renderItem={({ item }) => (
          <ListItem
            roundAvatar
            title={item.title}
            subtitle={item.amount + "元"}
            rightSubtitle={item.deadline}
            //rightSubtitle={this._dateString(new Date(item.date))}
            leftAvatar={{source:item.img}}
            checkmark
          >

          </ListItem>
        )}
        ItemSeparatorComponent={this.renderSeparator}
      >
      </FlatList>
      //</List>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  date: {
    color: 'green'
  }
});
