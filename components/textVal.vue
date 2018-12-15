<template>
	<rich-text :nodes="nodes"></rich-text>
</template>

<script>
	export default {
		props:['val'],
		data() {
			let val = this.val
			return {
			};
		},
		computed:{
			nodes: function(){
				return [
					{
						name: 'p',
						attrs: {
						
						},
						children: [{
							type: 'text',
							text: this.val.name
						},{
							name:'span',
							attrs: {
								class: 'body',
							},
							children:[
								{
									type: 'text',
									text: this.val.value
								}
							]
						}
						]
					}
				]
			}
		}
	}
</script>

<style>

</style>
