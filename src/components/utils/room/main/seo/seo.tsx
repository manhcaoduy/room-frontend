import * as React from "react";
import { Helmet } from "react-helmet";

interface SEOProps {
  description?: string;
  lang?: string;
  meta?: Array<{ name: string; content: string }>;
  title: string;
}

const Seo = ({
  description = "",
  lang = "en",
  meta = [],
  title = "",
}: SEOProps): JSX.Element => {
  // const { site } = useStaticQuery(
  //   graphql`
  //     query {
  //       site {
  //         siteMetadata {
  //           title
  //           description
  //           author
  //         }
  //       }
  //     }
  //   `
  // );
  //
  // const metaDescription = description || site.siteMetadata.description;
  // const defaultTitle = site.siteMetadata?.title;

  const metaDescription = "metaDescription";
  const defaultTitle = "defaultTitle";

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle && `%s | ${defaultTitle}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          // content: site.siteMetadata?.author || ``,
          content: "author",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  );
};

export default Seo;
