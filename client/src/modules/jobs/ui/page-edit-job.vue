<template>
  <FormJob
    v-if="isReady"
    :original-job="jobsStore.job"
    @save="edit"
    @cancel="cancel"
  />
</template>

<script>
import { loader } from '__cli/core/loader';
import { jobsStore } from '../domain';
import FormJob from './form-job';

export default {
  name: 'PageEditJob',
  components: { FormJob },
  data () {
    return {
      jobsStore: null
    };
  },
  computed: {
    isReady () {
      return this.jobsStore && this.jobsStore.job;
    }
  },
  mounted () {
    this.jobsStore = jobsStore;
  },
  methods: {
    edit (job) {
      loader.run(this.jobsStore.updateJob(job));
      this.$router.go(-1);
    },
    cancel () {
      this.$router.go(-1);
    }
  }
};
</script>
