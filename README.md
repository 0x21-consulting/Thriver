[![Build Status](https://travis-ci.org/enove/Thriver.svg?branch=wcasa-dev)](https://travis-ci.org/enove/Thriver)

# Thriver
Thriver is a Content Management System for Nonprofit Organizations.  Thriver helps staff communicate and engage with the community, provide education and services to its membership, accept payments and donations, and automate the more painful aspects of nonprofit work.  Thriver also helps the Board of Directors train and recruit, remain compliant on annual requirements, and retain a high-level view of the organization's activities and its alignment with organizational strategy.

## Getting Started
To contribute, you'll need the [Meteor](https://www.meteor.com/install) platform.

    curl https://install.meteor.com/ | sh
    git clone https://github.com/enove/Thriver.git
    cd Thriver
    meteor npm install
    meteor

Then navigate your web browser to http://localhost:3000/

## How can I help?
Thriver needs a lot of help.  The architecture needs to be re-evaluated and modified per [best practices](https://guide.meteor.com).  Furthermore, the platform was initially developed for a single institution.  Some parts of the platform still need to be abstracted.

### An incomplete list of major work that needs help:
* Abstraction from WCASA
* Architectural redesign
* Designing a system for applying organizational brand (fonts, colors, whitespace, etc)
* Better authorization mechanisms, esp. RBAC
* Technical writing and project management (deployment guides for non-techies, etc)
* Better package/extension support
* Better administration interface
* Basically all board-related visions still need to be programmed
* Init scripts for new contributors and users (right now the platform doesn't work without importing a sample db)
* A testing framework, including unit and integration testing

We use the shared repository model of the [Github Flow](https://guides.github.com/introduction/flow/) but may switch to the fork-and-pull model in the near future.

## License
Thriver is under the MIT License.

Copyright 2017 Micah Henning

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
