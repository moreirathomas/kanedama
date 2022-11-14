#!/bin/bash

curl -s "http://localhost:3000/registration?name=alice&email=alice@hey.com&password=1234" \
    > "./testdata/goldenmaster/registration.txt"

curl -s "http://localhost:3000/login?email=alice@hey.com&password=1234" \
    > "./testdata/goldenmaster/login.txt"