# logistics

## Greeting CLI

This repository includes a small command-line application that prints a
greeting. It uses only the Python standard library, accepts an optional name,
and can print the greeting in uppercase with `--uppercase`:

```sh
python3 greet.py
# Hello, world!

python3 greet.py Alice
# Hello, Alice!

python3 greet.py --uppercase
# HELLO, WORLD!

python3 greet.py Alice --uppercase
# HELLO, ALICE!

python3 greet.py --uppercase Alice
# HELLO, ALICE!
```

Run its automated tests with:

```sh
python3 -m unittest discover -s tests -v
```
