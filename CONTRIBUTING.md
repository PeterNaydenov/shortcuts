# Contributing to @peter.naydenov/shortcuts

Thank you for your interest in contributing to the shortcuts library! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socioeconomic status, nationality, personal appearance
- Race, religion, or sexual identity and orientation

### Our Standards

**Positive behavior that contributes to a welcoming environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**
- Harassment, trolling, or deliberate intimidation
- Publishing private information without explicit permission
- Any conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct. Project maintainers who do not follow the Code of Conduct may face temporary or permanent repercussions.

**Contact for enforcement issues:**
- Email: peter.naydenov@gmail.com
- GitHub: @PeterNaydenov




## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- Git
- Basic knowledge of JavaScript
- Familiarity with DOM events and browser APIs


### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/PeterNaydenov/shortcuts.git
   cd shortcuts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests to verify setup**
   ```bash
   npm test
   ```

### Project Structure

```
shortcuts/
├── src/                    # Source code
│   ├── methods/            # Core library methods
│   ├── plugins/            # Plugin implementations
│   └── main.js            # Main entry point
├── test/                  # Test files
├── test-helpers/          # Test utilities
└── dist/                  # Built distribution files
```





## 📝 Contribution Types

### Bug Reports

Before creating a bug report, please check:

1. **Existing issues** - Search for similar issues
2. **Latest version** - Ensure you're using the latest version
3. **Minimal reproduction** - Create a minimal test case

**Bug report template:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, macOS 13.0]
- Browser: [e.g., Chrome 119, Firefox 118]
- Library version: [e.g., 3.5.2]

## Additional Context
Any other relevant information
```

### Feature Requests

**Feature request template:**
```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any other relevant information
```



### Code Contributions

#### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Run quality checks**
   ```bash
   npm run lint          # Check code style
   npm run test          # Run all tests
   npm run test:coverage # Check test coverage
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new plugin feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create pull request on GitHub
   ```

#### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(click): add support for multiple target attributes
fix(hover): resolve hover detection on nested elements
docs: update API documentation for v4.0.0
test: add coverage for scroll plugin edge cases
```

## 🧪 Testing Guidelines

### Test Requirements

- **Unit tests** for all new functions
- **Integration tests** for plugin interactions
- **Browser tests** for DOM-related functionality
- **Minimum 80% code coverage** for new code

### Test Structure

```javascript
// test/07-your-plugin.test.js
import { beforeEach, afterEach, describe, it, test, expect } from 'vitest'
import { shortcuts, pluginYourPlugin } from '../src/main.js'

describe('YourPlugin', () => {
    let short

    beforeEach(() => {
        short = shortcuts()
        short.enablePlugin(pluginYourPlugin)
    })

    afterEach(() => {
        short.reset()
        short.disablePlugin('yourPlugin')
    })

    it('should register shortcuts correctly', () => {
        // Test implementation
    })

    it('should handle events properly', () => {
        // Test implementation
    })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test 07-your-plugin.test.js
```

## 📚 Documentation Contributions

### Types of Documentation

1. **Code Documentation** - JSDoc comments in source code
2. **API Documentation** - Technical API reference
3. **User Documentation** - README, examples, tutorials
4. **Developer Documentation** - Plugin development guides

### Documentation Standards

- **Clear and concise** language
- **Code examples** for all major features
- **Consistent formatting** with existing docs
- **Cross-references** to related topics

### Plugin Documentation

When creating a new plugin, include:

1. **Plugin purpose and use cases**
2. **Installation instructions**
3. **Configuration options**
4. **API reference**
5. **Usage examples**
6. **Migration guide** (if breaking changes)

## 🔧 Plugin Development

### Plugin Requirements

1. **Follow standard plugin structure**
2. **Implement required methods** (`getPrefix`, `shortcutName`, etc.)
3. **Handle edge cases** gracefully
4. **Provide comprehensive tests**
5. **Include TypeScript definitions**

### Plugin Structure

```javascript
// src/plugins/yourPlugin/index.js
import _normalizeShortcutName from './_normalizeShortcutName.js'
import _registerShortcutEvents from './_registerShortcutEvents.js'
import _listenDOM from './_listenDOM.js'

function pluginYourPlugin(setupPlugin, options = {}) {
    const deps = {
        regex: /YOUR_PLUGIN:.+/i,
        // ... other dependencies
    }

    const pluginState = {
        active: false,
        defaultOptions: {
            // Default configuration
        },
        listenOptions: {},
        // ... plugin-specific state
    }

    function resetState() {
        // Cleanup logic
    }
    deps.resetState = resetState

    return setupPlugin({
        prefix: 'yourPlugin',
        _normalizeShortcutName,
        _registerShortcutEvents,
        _listenDOM,
        pluginState,
        deps
    })
}

export default pluginYourPlugin
```

## 📋 Pull Request Process

### Before Submitting

1. **Code Quality**
   - [ ] Code follows project style guidelines
   - [ ] All tests pass
   - [ ] Test coverage is maintained or improved
   - [ ] Documentation is updated

2. **Functionality**
   - [ ] Feature works as expected
   - [ ] No breaking changes (unless documented)
   - [ ] Backward compatibility maintained

3. **Documentation**
   - [ ] README updated if needed
   - [ ] API docs updated
   - [ ] Examples provided for new features

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs tests
2. **Code review** - Maintainer review for quality and standards
3. **Testing** - Additional testing if needed
4. **Approval** - Merge after approval and checks pass

## ⚖️ Legal and Licensing

### Contributor License Agreement (CLA)

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

### Intellectual Property

- Ensure you have rights to contribute the code
- Don't include proprietary or confidential information
- Respect third-party licenses and copyrights
- Attribute properly when using external code

### License Compliance

- All contributions must be compatible with MIT License
- Include license headers for significant files
- Document any third-party dependencies
- Keep license information up to date

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and community discussion
- **Email** - Private or security-related matters

### Resources

- [API Documentation](./API.md)
- [Plugin Development Guide](./How.to.create.plugins.md)
- [Migration Guide](./Migration.guide.md)
- [Examples](./EXAMPLES.md)

## 🏆 Recognition

### Contributor Recognition

- **Contributors list** in README
- **Release notes** mention significant contributors
- **GitHub badges** for active contributors
- **Community spotlight** in project updates

### Becoming a Maintainer

Active contributors who demonstrate:
- Consistent quality contributions
- Good understanding of the codebase
- Helpful community engagement
- Commitment to project goals

May be invited to become maintainers with merge access.

## 📈 Project Goals

### Current Focus Areas

1. **Plugin ecosystem expansion**
2. **Performance optimization**
3. **TypeScript improvements**
4. **Browser compatibility**
5. **Documentation enhancement**





### Long-term Vision

- Become the de facto standard for user interaction with the interface;
- Support for emerging input methods (touch, voice, etc.);
- Comprehensive plugin marketplace;
- Strong community-driven development;

---

Thank you for contributing to @peter.naydenov/shortcuts! Your contributions help make this project better for everyone.

**Last updated:** November 2025
**Version:** 4.0.0