Simple-pub-sub is a simple Pub/Sub application acting like a messenger.

## Setup

You should have Node and NPM installed on your device.
Install the packages:

```
npm install
```

## Usage

You should run at least one instance of ```receive.js``` and one instance of ```send.js```.
When you run receive.js, you should pass the names of persons you want to receive message from
as arguments in your command. Here's an example.

```
node receive.js Iman Shahrooz
```

With this command you'll receive any message from Shahrooz and Iman.
When you run send.js, you should pass your name (the name of the sender)
and at least one word of message. Consider that any words after your name will be included
in one single message. Here's an example.

```
node send.js Iman Hi everyone
```

If an instance of the receive.js is listening to Iman's messages, it will log the message like:

```
 [x] Iman: 'Hi everyone'
```