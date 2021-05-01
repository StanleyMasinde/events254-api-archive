<template>
  <CreateEvent :create-url="`/api/groups/${$route.params.company.slug}/events`" />
</template>
<script>
export default {
  auth: false
}
</script>
