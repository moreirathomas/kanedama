#!/bin/bash

exit_code=0

registration="http://localhost:3000/registration?name=alice&email=alice@hey.com&password=password1234"
login="http://localhost:3000/login?email=alice@hey.com&password=password1234"

dir="./test/e2e"
registration_file="$dir/registration.txt"
login_file="$dir/login.txt"
golden_master_dir="./testdata/goldenmaster"

curl -s "$registration" > "$registration_file"

if ! cmp -s "$registration_file" "$golden_master_dir/registration.txt"; then
    printf 'Registration: fail\n'
    cat "$registration_file"
    printf '\n'
    exit_code=1
else
    printf 'Registration: pass\n'
fi

rm "$registration_file"

curl -s "$login" > "$login_file"


if ! cmp -s "$login_file" "$golden_master_dir/login.txt"; then
    printf 'Login: fail\n'
    cat "$login_file"
    printf '\n'
    exit_code=1
else
    printf 'Login: pass\n'
fi

rm "$login_file"

exit $exit_code
