# PNG Image Assets

This folder contains PNG versions of the application images and logos.

## Logo Files
- `logo.png`: The main application logo used across the Classentry application
- `logo-small.png`: A smaller version of the logo for favicon and mobile views

## How to Use
To use these images in the application:

```javascript
// For direct image import
import logo from '../assets/images/png/logo.png';

// Then in your component
<img src={logo} alt="Classentry Logo" />
```

For the SVG version of the logo (which provides better scaling), use the SVG version from the parent directory. 