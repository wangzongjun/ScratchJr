var re = /^\/\/#\ssourceMappingURL(.+)$/gm;

module.exports = function(src) {
    this.cacheable();
    return src.replace(re, '');
}
