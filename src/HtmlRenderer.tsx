const HtmlRenderer: React.FC<{ html: string }> = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };
export  default HtmlRenderer