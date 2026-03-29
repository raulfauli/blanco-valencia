## ADDED Requirements

### Requirement: Custom 404 error page

The system SHALL display a custom 404 error page when users navigate to non-existent routes.

#### Scenario: User navigates to non-existent URL

- **WHEN** user visits a URL that does not match any defined route
- **THEN** system SHALL display the custom 404 page
- **AND** page SHALL include a prominent "404" heading
- **AND** page SHALL display a friendly message in Spanish explaining the page was not found

#### Scenario: 404 page provides navigation options

- **WHEN** user views the 404 page
- **THEN** page SHALL include links to the homepage
- **AND** page SHALL include links to the blog section
- **AND** page SHALL include links to the rutas section
- **AND** page SHALL include links to the videos section

#### Scenario: 404 page uses consistent branding

- **WHEN** user views the 404 page
- **THEN** page SHALL use the BaseLayout for consistent header and footer
- **AND** page SHALL use the stone/emerald color scheme matching the site design
- **AND** page SHALL display the site logo or branding
