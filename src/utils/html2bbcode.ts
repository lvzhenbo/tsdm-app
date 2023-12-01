export function htmlToBBCode(html: string): string {
  let bbcode = html;
  const rep = function (reg: RegExp, str: string) {
    bbcode = bbcode.replace(reg, str);
  };
  rep(/<a.*?href=\\"(.*?)\\".*?>(.*?)<\/a>/gi, '[url=$1]$2[/url]');

  rep(
    /<font.*?color=\\"(.*?)\\".*?class=\\"codeStyle\\".*?>(.*?)<\/font>/gi,
    '[code][color=$1]$2[/color][/code]',
  );
  rep(
    /<font.*?color=\\"(.*?)\\".*?class=\\"quoteStyle\\".*?>(.*?)<\/font>/gi,
    '[quote][color=$1]$2[/color][/quote]',
  );
  rep(
    /<font.*?class=\\"codeStyle\\".*?color=\\"(.*?)\\".*?>(.*?)<\/font>/gi,
    '[code][color=$1]$2[/color][/code]',
  );
  rep(
    /<font.*?class=\\"quoteStyle\\".*?color=\\"(.*?)\\".*?>(.*?)<\/font>/gi,
    '[quote][color=$1]$2[/color][/quote]',
  );
  rep(/<span style="color: ?(.*?)">(.*?)<\/span>/gi, '[color=$1]$2[/color]');
  rep(/<font.*?color=\\"(.*?)\\".*?>(.*?)<\/font>/gi, '[color=$1]$2[/color]');
  rep(/<span style=\\"font-size:(.*?);\\">(.*?)<\/span>/gi, '[size=$1]$2[/size]');
  rep(/<font>(.*?)<\/font>/gi, '$1');
  rep(/<img.*?src="(.*?)".*?\/>/gi, '[img]$1[/img]');
  rep(/<span class=\\"codeStyle\\">(.*?)<\/span>/gi, '[code]$1[/code]');
  rep(/<span class=\\"quoteStyle\\">(.*?)<\/span>/gi, '[quote]$1[/quote]');
  rep(/<strong class=\\"codeStyle\\">(.*?)<\/strong>/gi, '[code][b]$1[/b][/code]');
  rep(/<strong class=\\"quoteStyle\\">(.*?)<\/strong>/gi, '[quote][b]$1[/b][/quote]');
  rep(/<em class=\\"codeStyle\\">(.*?)<\/em>/gi, '[code][i]$1[/i][/code]');
  rep(/<em class=\\"quoteStyle\\">(.*?)<\/em>/gi, '[quote][i]$1[/i][/quote]');
  rep(/<u class=\\"codeStyle\\">(.*?)<\/u>/gi, '[code][u]$1[/u][/code]');
  rep(/<u class=\\"quoteStyle\\">(.*?)<\/u>/gi, '[quote][u]$1[/u][/quote]');
  rep(/<p.*?style="text-align: (.*?)">(.*?)<\/p>/gi, '[align=$1]$2[/align]');
  rep(/<\/(strong|b)>/gi, '[/b]');
  rep(/<(strong|b)>/gi, '[b]');
  rep(/<\/(em|i)>/gi, '[/i]');
  rep(/<(em|i)>/gi, '[i]');
  rep(/<\/u>/gi, '[/u]');
  rep(/<span style=\\"text-decoration: ?underline;\\">(.*?)<\/span>/gi, '[u]$1[/u]');
  rep(/<u>/gi, '[u]');
  rep(/<s>/gi, '[s]');
  rep(/<\/s>/gi, '[/s]');
  rep(/<blockquote[^>]*>/gi, '[quote]');
  rep(/<\/blockquote>/gi, '[/quote]');
  rep(/<br \/>/gi, '\n');
  rep(/<br\/>/gi, '\n');
  rep(/<br>/gi, '\n');
  rep(/<p>/gi, '');
  rep(/<\/p>/gi, '\n');
  rep(/&nbsp;|\u00a0/gi, ' ');
  rep(/&quot;/gi, '"');
  rep(/&lt;/gi, '<');
  rep(/&gt;/gi, '>');
  rep(/&amp;/gi, '&');

  return bbcode;
}
