---
layout: post
title: FormatJS指南 3 - Message Syntax
tags: 原创 技术 翻译 React
---

[原文](https://formatjs.io/guides/message-syntax/)

    <p>
        If you are translating text you'll need a way for your translators to express the subtleties of spelling, grammar, and conjugation inherent in each language. We use the <a href="http://userguide.icu-project.org/formatparse/messages">ICU Message</a> syntax which is also used in <a href="http://docs.oracle.com/javase/7/docs/api/java/text/MessageFormat.html">Java</a> and <a href="http://php.net/manual/en/class.messageformatter.php">PHP</a>.
    </p>

    <p>
        The {{npmLink "intl-messageformat"}} library takes the message and input data and creates an appropriately formatted string. This feature is included with all of the <a>integrations</a> we provide.
    </p>

    <p>
        The following sections describe the ICU Message syntax and show how to use this features provided the {{brand}} libraries:
    </p>

    <section id="toc"></section>

    <section class="secs">
        <h2 id="basic-principles">
            Basic Principles
        </h2>

        <p>
            The simplest transform for the message is a literal string.
        </p>

```
Hello everyone
```

        <p>
            All other transforms are done using replacements called "arguments". They are enclosed in curly braces ({{code "{"}} and {{code "}"}}) and refer to a value in the input data.
        </p>
    </section>

    <section class="secs">
        <h2 id="simple-argument">
            Simple Argument
        </h2>

        <p>
            You can use a <code>{<var>key</var>}</code> argument for placing a value into the message. The <var>key</var> is looked up in the input data, and the string is interpolated with its value.
        </p>

{{#code highlight=false}}
Hello {who}
{{/code}}

    </section>

    <section class="secs">
        <h2 id="formatted-argument">
            Formatted Argument
        </h2>

        <p>
            Values can also be formatted based on their type. You use a <code>{<var>key</var>, <var>type</var>, <var>format</var>}</code> argument to do that.
        </p>

        <p>
            The elements of the argument are:
        </p>

        <ul>
            <li>
                <code><var>key</var></code> is where in the input data to find the data
            </li>
            <li>
                <code><var>type</var></code> is how to interpret the value (see below)
            </li>
            <li>
                <code><var>format</var></code> is optional, and is a further refinement on how to display that type of data
            </li>
        </ul>

{{#code highlight=false}}
I have {numCats, number} cats.
{{/code}}

        <section class="secs">
            <h3 id="number-type">
                {{code "number"}} Type
            </h3>

            <p>
                This type is used to format numbers in a way that is sensitive to the locale. It understands the following values for the optional <code><var>format</var></code> element of the argument:
            </p>

            <ul>
                <li>
                    <code>percent</code> is used to format values which are percentages
                </li>
            </ul>

{{#code highlight=false}}
I have {numCats, number} cats.
Almost {pctBlack, number, percent} of them are black.
{{/code}}

            <p>
                Internally it uses the {{code "Intl.NumberFormat"}} API. You can <a href="#custom-formats">define custom values</a> for the <code><var>format</var></code> element, which are passed to the {{code "Intl.NumberFormat"}} constructor.
            </p>
        </section>

        <section class="secs">
            <h3 id="date-type">
                {{code "date"}} Type
            </h3>

            <p>
                This type is used to format dates in a way that is sensitive to the locale. It understands the following values for the optional <code><var>format</var></code> element of the argument:
            </p>

            <ul>
                <li>
                    <code>short</code> is used to format dates in the shortest possible way
                </li>
                <li>
                    <code>medium</code> is used to format dates with short textual representation of the month
                </li>
                <li>
                    <code>long</code> is used to format dates with long textual representation of the month
                </li>
                <li>
                    <code>full</code> is used to format dates with the most detail
                </li>
            </ul>

{{#code highlight=false}}
Sale begins {start, date, medium}
{{/code}}

            <p>
                Internally it uses the {{code "Intl.DateTimeFormat"}} API. You can <a href="#custom-formats">define custom values</a> for the <code><var>format</var></code> element, which are passed to the {{code "Intl.DateTimeFormat"}} constructor.
            </p>
        </section>

        <section class="secs">
            <h3 id="time-type">
                {{code "time"}} Type
            </h3>

            <p>
                This type is used to format times in a way that is sensitive to the locale. It understands the following values for the optional <code><var>format</var></code> element of the argument:
            </p>

            <ul>
                <li>
                    <code>short</code> is used to format times with hours and minutes
                </li>
                <li>
                    <code>medium</code> is used to format times with hours, minutes, and seconds
                </li>
                <li>
                    <code>long</code> is used to format times with hours, minutes, seconds, and timezone
                </li>
                <li>
                    <code>full</code> is the same as <code>long</code>
                </li>
            </ul>

{{#code highlight=false}}
Coupon expires at {expires, time, short}
{{/code}}

            <p>
                Internally it uses the {{code "Intl.DateTimeFormat"}} API. You can <a href="#custom-formats">define custom values</a> for the <code><var>format</var></code> element, which are passed to the {{code "Intl.DateTimeFormat"}} constructor.
            </p>
        </section>

        <section class="secs">
            <h3 id="custom-formats">
                Defining Custom Formats
            </h3>

            <p>
                The
                <code>{<var>key</var>, number, <var>format</var>}</code>,
                <code>{<var>key</var>, date, <var>format</var>}</code>, and
                <code>{<var>key</var>, time, <var>format</var>}</code>
                arguments come with predefined values for the <code><var>format</var></code> element, but you can define your own. You do this by passing a simple JavaScript object to each of the <a href="{{pathTo 'integrations'}}">integrations</a>, in a way that is distinct for each integration.
            </p>

            <p>
                The key of the object is the <code><var>type</var></code>, and the value is a simple JavaScript object of formats for that type. These format options are passed to the <code><var>options</var></code> argument of the associated constructor.
            </p>

            <p>
                For example, if you want to define a new <code>usd</code> (US dollars) format for numbers, you could do the following:
            </p>

{{#code "js"}}
formats = {
    number: {
        usd: { style: 'currency', currency: 'USD' }
    }
};
{{/code}}

{{#code highlight=false}}
Your total is {total, number, usd}
{{/code}}

        </section>
    </section>

    <section class="secs">
        <h2 id="select-format">
            {{code "{select}"}} Format
        </h2>

        <p>
            The <code>{<var>key</var>, select, <var>matches</var>}</code> is used to choose output by matching a value to one of many choices. (It is similar to the <code>switch</code> statement available in some programming languages.) The <code><var>key</var></code> is looked up in the input data. The corresponding value is matched to one of <code><var>matches</var></code> and the corresponding output is returned. The <code><var>matches</var></code> is a space-separated list of matches.
        </p>

        <p>
            The format of a match is <code><var>match</var> {<var>output</var>}</code>. (A match is similar to the <code>case</code> statement of the <code>switch</code> found in some programming languages.) The <code><var>match</var></code> is a literal value. If it is the same as the value for <code><var>key</var></code> then the corresponding <code><var>output</var></code> will be used.
        </p>

        <p>
            <code><var>output</var></code> is itself a message, so it can be a literal string or also have more arguments nested inside of it.
        </p>

        <p>
            The <code>other</code> match is special and is used if nothing else matches. (This is similar to the <code>default</code> case of the <code>switch</code> found in some programming languages.)
        </p>

{{#code highlight=false}}
{gender, select,
    male {He}
    female {She}
    other {They}
} will respond shortly.
{{/code}}

        <p>
            Here's an example of nested arguments.
        </p>

{{#code highlight=false}}
{taxableArea, select,
    yes {An additional {taxRate, number, percent} tax will be collected.}
    other {No taxes apply.}
}
{{/code}}

    </section>

    <section class="secs">
        <h2 id="plural-format">
            {{code "{plural}"}} Format
        </h2>

        <p>
            The <code>{<var>key</var>, plural, <var>matches</var>}</code> is used to choose output based on the pluralization rules of the current locale. It is very similar to the <a href="#select-format">{{code "{select}"}} format above</a> except that the value is expected to be a number and is mapped to a <a href="http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html">plural category</a>.
        </p>

        <p>
            The <code><var>match</var></code> is a literal value and is matched to one of these plural categories. Not all languages use all plural categories.
        </p>

        <dl>
            <dt><code>zero</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for zero number of items. (Examples are Arabic and Latvian.)
            </dd>
            <dt><code>one</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for one item. Many languages, but not all, use this plural category. (Many popular Asian languages, such as Chinese and Japanese, do not use this category.)
            </dd>
            <dt><code>two</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for two items. (Examples are Arabic and Welsh.)
            </dd>
            <dt><code>few</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for a small number of items. For some languages this is used for 2-4 items, for some 3-10 items, and other languages have even more complex rules.
            </dd>
            <dt><code>many</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for a larger number of items. (Examples are Arabic, Polish, and Russian.)
            </dd>
            <dt><code>other</code></dt>
            <dd>
                This category is used if the value doesn't match one of the other plural categories. <strong>Note</strong> that this is used for "plural" for languages (such as English) that have a simple "singular" versus "plural" dichotomy.
            </dd>
            <dt><code>=<var>value</var></code></dt>
            <dd>
                This is used to match a specific value regardless of the plural categories of the current locale.
            </dd>
        </dl>

{{#code highlight=false}}
Cart: {itemCount} {itemCount, plural,
    one {item}
    other {items}
}
{{/code}}

{{#code highlight=false}}
You have {itemCount, plural,
    =0 {no items}
    one {1 item}
    other \{{itemCount} items}
}.
{{/code}}

        <p>
            In the <code><var>output</var></code> of the match, the <code>#</code> special token can be used as a placeholder for the numeric value and will be formatted as if it were <code>{<var>key</var>, number}</code>.
        </p>

{{#code highlight=false}}
You have {itemCount, plural,
    =0 {no items}
    one {# item}
    other {# items}
}.
{{/code}}

    </section>

    <section class="secs">
        <h2 id="selectordinal-format">
            {{code "{selectordinal}"}} Format
        </h2>

        <p>
            The <code>{<var>key</var>, selectordinal, <var>matches</var>}</code> is used to choose output based on the ordinal pluralization rules (1st, 2nd, 3rd, etc.) of the current locale. It is very similar to the <a href="#plural-format">{{code "{plural}"}} format above</a> except that the value is mapped to an <a href="http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html">ordinal plural category</a>.
        </p>

        <p>
            The <code><var>match</var></code> is a literal value and is matched to one of these plural categories. Not all languages use all plural categories.
        </p>

        <dl>
            <dt><code>zero</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for zero number of items. (Examples are Arabic and Latvian.)
            </dd>
            <dt><code>one</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for one item. Many languages, but not all, use this plural category. (Many popular Asian languages, such as Chinese and Japanese, do not use this category.)
            </dd>
            <dt><code>two</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for two items. (Examples are Arabic and Welsh.)
            </dd>
            <dt><code>few</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for a small number of items. For some languages this is used for 2-4 items, for some 3-10 items, and other languages have even more complex rules.
            </dd>
            <dt><code>many</code></dt>
            <dd>
                This category is used for languages that have grammar specialized specifically for a larger number of items. (Examples are Arabic, Polish, and Russian.)
            </dd>
            <dt><code>other</code></dt>
            <dd>
                This category is used if the value doesn't match one of the other plural categories. <strong>Note</strong> that this is used for "plural" for languages (such as English) that have a simple "singular" versus "plural" dichotomy.
            </dd>
            <dt><code>=<var>value</var></code></dt>
            <dd>
                This is used to match a specific value regardless of the plural categories of the current locale.
            </dd>
        </dl>

        <p>
            In the <code><var>output</var></code> of the match, the <code>#</code> special token can be used as a placeholder for the numeric value and will be formatted as if it were <code>{<var>key</var>, number}</code>.
        </p>

{{#code highlight=false}}
It's my cat's {year, selectordinal,
    one {#st}
    two {#nd}
    few {#rd}
    other {#th}
} birthday!
{{/code}}

    </section>
