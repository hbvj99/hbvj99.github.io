export function getPostDate(post: any): Date {
  if (post.data.date) {
    return new Date(post.data.date);
  }
  const filename = post.id.split('/').pop() || '';
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return new Date(`${match[1]}-${match[2]}-${match[3]}`);
  }
  return new Date();
}

export function getPostUrl(post: any): string {
  const filename = post.id.split('/').pop() || '';
  const filenameWithoutExt = filename.replace(/\.md$/, '');
  const match = filenameWithoutExt.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/);
  if (match) {
    return `/${match[1]}/${match[2]}/${match[3]}.html`;
  }
  const dateObj = getPostDate(post);
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const s = filenameWithoutExt;
  return `/${y}/${m}/${s}.html`;
}
