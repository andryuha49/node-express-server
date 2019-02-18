import i18n from 'i18n';

export const useI18n = (server: any, configuration: any) => {
  i18n.configure(Object.assign({
    locales: ['en'],
    directory: __dirname + '/../assets/i18n',
    queryParameter: 'lang',
    updateFiles: false,
    api: {
      '__': 'i18n',  //now req.__ becomes req.t
      '__n': 'i18nn' //and req.__n can be called as req.tn
    },
    extension: '.json',
    defaultLocale: 'en',
    register: global
  }, configuration));
  return server;
};