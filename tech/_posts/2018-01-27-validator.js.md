---
layout: post
title: validator.js文档
tags: 原创 技术 翻译
---

[原文](http://github.com/chriso/validator.js)

基于字符串的验证和过滤净化库。

## Strings only

**本代码库仅基于字符串进行验证和过滤净化**

如果不确认你的输入是否是一个字符串，可以使用`'' + input`将其强制转化。如果传入的参数不是字符串，会抛出错误。

## 安装和使用

### 服务端使用

`npm install validator`

#### No ES6

```javascript
var validator = require('validator');

validator.isEmail('foo@bar.com'); //=> true
```

#### ES6

```javascript
import validator from 'validator';
```

或，只引入库的一部分。

```javascript
import isEmail from 'validator/src/lib/isEmail';
```

### 客户端使用

本代码库可以通过script单独加载，或通过[AMD][amd]加载器加载。

```html
<script type="text/javascript" src="validator.min.js"></script>
<script type="text/javascript">
  validator.isEmail('foo@bar.com'); //=> true
</script>
```

## 验证器

下表是目前可用的验证器列表。

验证器                                  | 说明
--------------------------------------- | --------------------------------------
**equals(str, comparison)**             | 检查两个字符串是否全等。
**contains(str, seed)**                 | 检查第一个字符串参数中是否包含第二个字符串参数。
**matches(str, pattern [, modifiers])** | 检查第一个字符串参数是否匹配第二个字符串参数的模式。<br/><br/>支持`matches('foo', /foo/i)`和`matches('foo', 'foo', 'i')`两种形式。
**isAfter(str [, date])**               | 检查字符串参数日期是否在指定日期之后（默认是现在）。
**isAlpha(str [, locale])**             | 检查字符串参数是否只包含字母（a-zA-Z）。<br/><br/>本地化选项支持`['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`，默认值是`en-US`。
**isAlphanumeric(str [, locale])**      | 检查字符串参数是否只包含字母和数字。（<br/><br/>本地化选项支持`['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sk-SK', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`，默认值是`en-US`.
**isAscii(str)**                        | 检查字符串参数是否只包含ASCII字符。
**isBase64(str)**                       | 检查字符串参数是否是一个Base64编码形式。
**isBefore(str [, date])**              | 检查字符串参数日期是否在指定日期之前（默认是现在）。
**isBoolean(str)**                      | 检查字符串参数是否是一个有效的布尔值。
**isByteLength(str, options)**          | 检查字符串参数的字节长度（UTF-8字节）是否在指定区间内。<br/><br/>`options`默认值为`{min:0, max: undefined}`。
**isCreditCard(str)**                   | 检查字符串参数是否是一个有效的信用卡号。 
**isCurrency(str, options)**            | 检查字符串参数是否是一个有效的货币数量。<br/><br/>`options`默认值为`{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_decimal: true, require_decimal: false, digits_after_decimal: [2], allow_space_after_digits: false}`.<br/>**Note:** 参数`digits_after_decimal`数组用精确的数字填写，不允许范围，比如范围1到3需要用[1, 2, 3]表示。
**isDataURI(str)**                      | 检查字符串参数是否是一个[data uri格式](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs)。
**isDecimal(str, options)**             | 检查字符串是否是一个有效的数字（包含整数和浮点数），比如0.1，.3，1.1，1.00003，4.0等等。<br/><br/>`options`的默认值是`{force_decimal: false, decimal_digits: '1,', locale: 'en-US'}`<br/><br/>`locale`本地化支持`['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`，用来检查小数点的格式。<br/>**提醒：** `decimal_digits`用来限定小数位数，'1,3'代表最大3位小数，最小1位小数。
**isDivisibleBy(str, number)**          | 检查第一个字符串参数能否被第二个数字参数整除。
**isEmail(str [, options])**            | 检查字符串参数是否是一个合法的邮箱地址。<br/><br/>`options`参数默认值是`{ allow_display_name: false, require_display_name: false, allow_utf8_local_part: true, require_tld: true }`。设置`allow_display_name`为真，则会匹配为`Display Name <email-address>`。设置`require_display_name`为真，则会严格匹配为`Display Name <email-address>`。设置`allow_utf8_local_part`为假，则不允许非英文的Unicode字符。设置`require_tld`为假，则不会强制要求域名部分以顶级域名结尾。
**isEmpty(str)**                        | 检查字符串参数是否是一个空字符串。
**isFQDN(str [, options])**             | 检查字符串参数是否是一个完整有效的域名（比如：domain.com）。<br/><br/>`options`参数默认值是`{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`。
**isFloat(str [, options])**            | 检查字符串参数是否是一个有效的数字（包含整数和浮点数）。<br/><br/>可以设置`options`的`min`、`max`、`gt`和/或`lt`，来检查浮点数是否在某个范围内（比如：`{ min: 7.22, max: 9.55 }`），也可以通过`locale`来设置本地化。<br/><br/>`min`和`max`是“大于等于”或“大于等于”的意思，`gt`和`lt`是其本身的含义。<br/><br/>本地化`locale`默认值是'en-US'，支持`['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'it-IT', 'nb-NO', 'nl-NL', 'nn-NO', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sr-RS', 'sr-RS@latin', 'sv-SE', 'tr-TR', 'uk-UA']`。
**isFullWidth(str)**                    | 检查字符串参数中是否包含全角字符。
**isHalfWidth(str)**                    | 检查字符串参数中是否包含半角字符。
**isHash(str, algorithm)**              | 检查字符串参数是否是一个指定算法的哈希值。<br/><br/>支持的算法有`['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128', 'tiger160', 'tiger192', 'crc32', 'crc32b']`。
**isHexColor(str)**                     | 检查字符串参数是否是一个有效的十六进制颜色字符串。
**isHexadecimal(str)**                  | 检查字符串参数是否是一个有效的十六进制数字。
**isIP(str [, version])**               | 检查字符串参数是否是一个有效IP（版本4或6）。
**isISBN(str [, version])**             | 检查字符串参数是否是一个有效的国际标准书号 (版本10或13)。
**isISSN(str [, options])**             | 检查字符串参数是否是一个有效的[标准国际刊号ISSN](https://en.wikipedia.org/wiki/International_Standard_Serial_Number).<br/><br/>`options`参数默认值是`{ case_sensitive: false, require_hyphen: false }`。如果`case_sensitive`设置为真，则ISSN结尾字符`'x'`为大写。
**isISIN(str)**                         | 检查字符串参数是否是一个有效的[国际证券识别码ISIN][ISIN] (stock/security identifier).
**isISO8601(str)**                      | 检查字符串参数是否是一个有效的[ISO 8601日期时间字符串](https://en.wikipedia.org/wiki/ISO_8601)。
**isISO31661Alpha2(str)**               | 检查字符串参数是否是一个有效的[ISO 3166-1 alpha-2国家地区代码](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)。
**isISRC(str)**                         | 检查字符串参数是否是一个有效的[国际标准音像制品编码ISRC](https://en.wikipedia.org/wiki/International_Standard_Recording_Code)。
**isIn(str, values)**                   | 检查字符串参数是否是数组（包含字符串）或对象（Object）中的一个有效值。
**isInt(str [, options])**              | 检查字符串参数是否是一个有效的整数。<br/><br/>可以设置`options`的`allow_leading_zeroes`，来禁用整数是否可以以0开头，（比如：`{ allow_leading_zeroes: false }`）。<br />可以设置`options`的`min`和/或`max`来检查整数是否在某个范围（包含端点）（比如：`{ min: 10, max: 99 }`）。<br />可以设置`options`的`gt`和/或`lt`来检查整数是否在某个区间内（不包含端点）（比如：`{gt: 1, lt: 4}`）。
**isJSON(str)**                         | 检查字符串参数是否是一个有效的JSON字符串（备注：使用JSON.parse）。
**isLatLong(str)**                      | 检查字符串参数是否是一个有效的经纬度坐标，格式：`lat,long`、`(lat,long)`、`lat, long`或`(lat, long)`。
**isLength(str, options)**              | 检查字符串参数的长度是否在指定区间内。<br/><br/>`options`参数默认值是`{min:0, max: undefined}`。提醒：这个方法将代理对字符视为1。
**isLowercase(str)**                    | 检查字符串参数是否全是小写格式。
**isMACAddress(str)**                   | 检查字符串参数是否是有效的MAC地址。
**isMD5(str)**                          | 检查字符串参数是否是一个MD5哈希值。
**isMimeType(str)**                     | 检查字符串参数是否是一个有效的[MIME类型](https://en.wikipedia.org/wiki/Media_type)格式。
**isMobilePhone(str, locale)**          | 检查字符串参数是否是一个有效的手机号码，<br/><br/>（locale参数支持`['ar-AE', 'ar-DZ','ar-EG', 'ar-JO', 'ar-SA', 'ar-SY', 'cs-CZ', 'de-DE', 'da-DK', 'el-GR', 'en-AU', 'en-CA', 'en-GB', 'en-HK', 'en-IN',  'en-KE', 'en-NG', 'en-NZ', 'en-RW', 'en-SG', 'en-UG', 'en-US', 'en-TZ', 'en-ZA', 'en-ZM', 'en-PK', 'es-ES', 'et-EE', 'fa-IR', 'fi-FI', 'fr-FR', 'he-IL', 'hu-HU', 'it-IT', 'ja-JP', 'ko-KR', 'lt-LT', 'ms-MY', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'ro-RO', 'ru-RU', 'sk-SK', 'sr-RS', 'tr-TR', 'uk-UA', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-TW']`或'any'。如果使用的是'any'，会尝试匹配所有可用的本地化参数。
**isMongoId(str)**                      | 检查字符串参数是否是一个有效的用16进制表示的[MongoDB ObjectId][mongoid]。
**isMultibyte(str)**                    | 检查字符串参数中是否包含多字节字符。
**isNumeric(str)**                      | 检查字符串参数是否只包含数字（包含符号）。
**isPort(str)**                         | 检查字符串参数是否是有效的端口号。
**isPostalCode(str, locale)**           | 检查字符串参数是否是一个邮政编码，<br/><br/>（locale参数支持`[ 'AT', 'AU', 'BE', 'CA', 'CH', 'CN', 'CZ', 'DE', 'DK', 'DZ', 'ES', 'FI', 'FR', 'GB', 'GR', 'IL', 'IN', 'IS', 'IT', 'JP', 'KE', 'LI', 'MX', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SA', 'SE', 'TW', 'US', 'ZA', 'ZM' ]`或'any'。如果使用的是'any'，会尝试匹配所有可用的本地化参数。
**isSurrogatePair(str)**                | 检查字符串参数中是否包含代理对字符。
**isURL(str [, options])**              | 检查字符串参数是否是一个合法的URL。<br/><br/>`options`默认值是`{ protocols: ['http', 'https', 'ftp'], require_protocol: false, require_valid_protocol: true, require_host: true, require_tld: true, host_whitelist: false, host_blacklist: false, allow_underscores: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
**isUUID(str [, version])**             | 检查字符串参数是否是一个UUID（版本3，4或5）。
**isUppercase(str)**                    | 检查字符串参数是否全是大写格式。
**isVariableWidth(str)**                | 检查字符串参数是否同时包含半角和全角字符。
**isWhitelisted(str, chars)**           | 检查字符串参数中的所有字符是否都在白名单列表中。

## 过滤净化器

下表是目前可用的过滤净化器列表。

过滤净化器                             | 说明 
-------------------------------------- | -------------------------------
**blacklist(input, chars)**            | 删除字符串参数中所有出现的黑名单字符。黑名单字符串会被用在正则表达式中，所以需要将字符串编码，比如`blacklist(input, '\\[\\]')`。
**escape(input)**                      | 将字符`<`，`>`，`&`，`'`，`"`和`/`替换为HTML实体字符。
**unescape(input)**                    | 将HTML实体字符替换为`<`，`>`，`&`， `'`， `"`和`/`。
**ltrim(input [, chars])**             | 剪除字符串参数左边的字符（空白或指定字符）。
**normalizeEmail(email [, options])**  | 规范化邮箱地址（这个方法不会验证邮箱的有效性，如果需要验证，使用之前的`isEmail`方法）。<br/><br/>`options`参数默认值为：<br/>*all_lowercase: true* - 将邮箱地址本地部分（@符号之前）都转化为小写字符。注意这个细节跟RFC 5321不完全相符，规范中规定：邮箱服务提供商要信任邮箱中的大写字符（但事实不完全是，邮箱提供商可能没这么做）。邮箱的domain部分是全小写，遵循RFC 1035。<br />*gmail_lowercase: true* - GMail邮箱地址忽略大小写，即使*all_lowercase*设置为假值。请注意*all_lowercase*即使设置为真值，Gmail地址也会以小写为准。<br />*gmail_remove_dots: true*: 删除邮箱中的点号（比如："john.doe"和"johndoe"完全等价）<br />*gmail_remove_subaddress: true*: 删除"sub-addresses"，即+号后面部分（比如："foo+bar@gmail.com"转化为"foo@gmail.com"）。<br />*gmail_convert_googlemaildotcom: true*: 将@googlemail.com转化为@gmail.com，两者是等价的。<br />*outlookdotcom_lowercase: true* - Outlook.com邮箱地址（包含Windows Live和Hotmail）忽略大小写，即使*all_lowercase*设置为假值。请注意*all_lowercase*即使设置为真值，Outlook.com地址也会以小写为准。<br />*outlookdotcom_remove_subaddress: true*: 删除"sub-addresses"，即+号后面部分（比如："foo+bar@outlook.com"转化为"foo@outlook.com"）。<br />*yahoo_lowercase: true* - Yahoo Mail邮箱地址忽略大小写，即使*all_lowercase*设置为假值。请注意*all_lowercase*即使设置为真值>，Yahoo Mail地址也会以小写为准。<br />*yahoo_remove_subaddress: true*: 删除"sub-addresses"，即-号后面部分（比如："foo-bar@yahoo.com"转化为"foo@yahoo.com"）。<br />*icloud_lowercase: true* - iCloud邮箱地址（包含MobileMe）忽略大小写，即使*all_lowercase*设置为假值。请注意*all_lowercase*即使设置为真值，iCloud地址也会以小写为准。<br />*icloud_remove_subaddress: true*: 删除"sub-addresses"，即+号后面部分（比如："foo+bar@icloud.com"转化为"foo@icloud.com"）。
**rtrim(input [, chars])**             | 剪除字符串参数右边的字符（空白或指定字符）。
**stripLow(input [, keep_new_lines])** | 删除字符串参数中的控制字符（编码小于32和127，几乎所有的控制字符）。如果设置`keep_new_lines`为`true`，会保留（`\n`和`\r`，十六进制`0xA`和`0xD`）。JavaScript中的Unicode字符是安全的。
**toBoolean(input [, strict])**        | 将字符串参数转化为布尔值，除`'0'`、`'false'`、`''`3个值之外都返回`true`。在严格模式下，只有`'1'`和`'true'`2个值返回`true`。
**toDate(input)**                      | 将字符串参数转化为日期对象，当输入参数不合法时返回`null`。
**toFloat(input)**                     | 将字符串参数转化为浮点数，当输入参数不合法时返回`NaN`。
**toInt(input [, radix])**             | 将字符串参数转化为整数，当输入参数不合法时返回`NaN`。
**trim(input [, chars])**              | 剪除字符串参数左右两边的字符（空白或指定字符）。
**whitelist(input, chars)**            | 删除未出现在白名单字符串中的字符。 白名单字符串会被用在正则表达式中，所以需要将字符串编码，比如`whitelist(input, '\\[\\]')`。

### XSS 过滤净化

XSS过滤净化功能在[2d5d6999](https://github.com/chriso/validator.js/commit/2d5d6999541add350fb396ef02dc42ca3215049e)从库中移除了。

如果需要，可以选择Yahoo的[xss-filters库](https://github.com/yahoo/xss-filters)，或[DOMPurify](https://github.com/cure53/DOMPurify)。

## 开发&发布

```sh
$ npm start
$ npm run build
```

## 阅读

验证器有时会失效，查阅[常见错误的编码假设](https://github.com/jameslk/awesome-falsehoods)。

## 编者按

仔细阅读这个库的代码，整体质量非常高，除了个别方法中使用能力Array.prototype.includes方法之外，基本上没有兼容性问题。locale的默认值都是'en-us'，可以简单的将其修改为'zh-cn'，方便本地化使用。
