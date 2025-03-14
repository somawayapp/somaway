import React from 'react';
import { Helmet } from 'react-helmet';

const SinglePostPage = ({ post }) => {
  const title = post?.title || 'Loading...';
  const author = post?.author || 'Unknown';
  const description = post?.description || 'A detailed summary of the book.';
  const imageUrl = post?.image || 'https://example.com/default-image.jpg';
  const url = `https://makesomaway.com/post/${post?.id}`;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Helmet>
        <title>{`${title} by ${author} - Book Summary`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`book summary, ${title}, ${author}, literature`} />
        <meta property="og:title" content={`${title} by ${author}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} by ${author}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
        <link rel="canonical" href={url} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            'name': title,
            'author': author,
            'image': imageUrl,
            'description': description,
            'url': url
          })}
        </script>
      </Helmet>

      <article>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <h2 className="text-lg text-gray-600">By {author}</h2>
        <img src={imageUrl} alt={`${title} cover`} className="rounded-md my-4" />
        <p>{description}</p>
      </article>
    </div>
  );
};

export default SinglePostPage;
