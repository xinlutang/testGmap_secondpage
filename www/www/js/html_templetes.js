			<script id="worker-schedule-template" type="text/x-handlebars-template">
				<ul data-role="listview" data-inset="true">

				{{#jobs}}
				{{#date}}
				<li data-role="list-divider">
				{{date}} <span class="ui-li-count">{{numberofelements}}</span>
				</li>

				{{/date}}{{#companies}}
				<li>
				<a href="#worker_check_schedule_job_page"> <h2>{{companyname}}</h2>
				<p>
				<strong>{{address}}</strong>
				</p>
				<p class="ui-li-aside">
				<strong>{{timerange}}</strong>
				</p> </a>
				</li>
				{{/companies}}{{/jobs}}
				</ul>
			</script>