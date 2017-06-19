# Basic Git Usage

This is your basic git usage guide - by no means is this supposed to be a complete repository of git knowledge, but hopefully you should be able to use it as a good start! If you have questions, Google is your best friend. Past that, feel free to ask anyone!

Here are some great resources that are most definitely better than this one:
* [git - the simple guide](http://rogerdudler.github.io/git-guide/)
* [Interactive Guide to git](https://try.github.io/levels/1/challenges/1)
* [You can also use github desktop - some like it, some don't](https://desktop.github.com)
---

The whole idea with git is __Version Control__. The Ubyssey has many different people working on different things, all from the same code base. Git allows us to work on our own tasks without interfering with anyone else. This is done by creating _branches_ off of the _Master Branch_ (in our case, it is called _develop_. The master branch is where the 'good copy' of our code lives). We work on our branches, and once we are satisfied with our work, we _commit_ the changes. We then _push_ the changes back onto the Develop Branch. You then create a _pull request_, asking if you can make your changes to the master branch. If the changes are accepted, the pull request is _merged_, and your code is now a part of the master branch!
Github is just a super popular platform to view git repositories, and definitely something that is good to get acquainted with.

### Starting out
First make sure you install git correctly! For that, go to these places:
* [Download git for OSX](https://git-scm.com/download/mac)
* [Download git for Windows](https://git-for-windows.github.io)
* [Download git for Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)


You will most likely start out on the master branch _develop_. As well, lets say that you are working on the hypothetical branch _new_feature_branch_. To get onto _new_feature_branch_, type into your terminal

`git checkout new_feature_branch`

You should get a message like 
