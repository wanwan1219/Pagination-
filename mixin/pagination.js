export default {
    methods: {
        changePage(page) {
            let query = JSON.parse(JSON.stringify(this.$route.query));
            query["page"] = page;
            let url = this.$route.path + '?' + this.$utils.urlEncode(query).substr(1);
            this.$router.push(url);
        },

    }
}
