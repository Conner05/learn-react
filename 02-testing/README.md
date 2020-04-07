# Testing

Testing is a crucial weapon of any developer's arsenal. Testing ensures your code actually does what you coded it to do. Therefore, understanding how to write *good* tests is vital.

Having said that, this is not an article on what testing *is*, nor is it intended to teach you *how* write tests. The intention of this is teach you how to write tests *in React*. Now, along with that, you may learn some things about what testing *is* or *how* to write tests in general. But, if in the course of learning how to test *in React* you may end up learning some of the fundamentals, as well.

## Why Write Tests?

We can all agree testing is important. After all, there are entire divisions of IT departments specifically devoted to testing software. Why, then, should *we* test? If there are people paid to do it, why should we? Well, first of all, programmatic testing is faster than manual testing. So, increased efficiency is one reason. Secondly, programmatic testing is more deterministic, less error prone. Which, in turn, means increased accuracy. A by-product of increased efficiency and accuracy is peace of mind. And that peace of mind extends from the hands developing the software all the way to end user using the software. 

There's also the idea of *professionalism* at play here. As a software developer, you are a professional. Much like any other professional: doctors, lawyers, architects, scientists, we are the experts. That's worth repeating: **When it comes to developing software, we are the experts.** That said, there's a degree of responsibility that comes along with being an expert in some field. Writing good, working software is part of that responsibility. Since writing tests increases the likelihood of good, working software, we *ought* to write tests. Even further, one could say, with some valid degree of authority, that *not* writing tests is unprofessional. And, in certain fields, such as where good, working software could very well be the determining factor of someone's life, for example, medical software or transportation (plane, train, car, truck, spaceship) software, one could say *not* writing tests is dangerous and reckless.

For more insights into *why* developers should be writing tests, see [Uncle Bob Martin's talk on Professionalism](https://youtu.be/p0O1VVqRSK0). It's well-worth the 45 minutes.

## Not All Testing Is Created Equal

Programmatic testing falls under a few different categories. Those categories have different names depending who you ask. For our purposes we'll call them **unit, functional, and integration** tests. All three serve different purposes. Our focus will mainly be on **unit** and **functional** tests. 

## Tools

Just as this is not an article on what testing *is* or *how* to write tests, this is also not intended to teach you all about the specific libraries we'll be using. You'll learn stuff about them, sure. But, if you want to understand them any more than a working capacity then you'll need to seek that out yourself.

We'll be using [Jest](https://jestjs.io/) as our test runner. Under the hood it uses a tool called [jsdom](https://github.com/jsdom/jsdom), which is basically a browser imitator built in Javascript, running on Node.js.

We'll also introduce [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) as a way to help us write better tests without relying on implementation details. More on that later.